import SuccessDialog from '@components/SuccessDialog'
import { Alert, Box, Container, Link } from '@mui/material'
import { ElementRef, useEffect, useRef, useState } from 'react'

import Loading from '@/components/Loading'
import { useAlert } from '@/hooks'
import AddressCard from '@/modules/AddressCard'
import CreateOrImportGuide from '@/modules/CreateOrImportGuide'
import CreateStepDialog from '@/modules/CreateStepDialog'
import ExportWalletDialog from '@/modules/ExportWalletDialog'
import Header from '@/modules/Header'
import ImportWalletDialog from '@/modules/ImportWalletDialog'
import TransactionList from '@/modules/TransactionList'
import Transfer from '@/modules/Transfer'
import Welcome from '@/modules/Welcome'
import {
  connect,
  heartBeat,
  queryBackupStatus,
  requestAccount,
} from '@/service/metamask'
import { TxRecordItem } from '@/service/models'
import { NetworkItem } from '@/service/models'
import { ethers, provider } from '@/utils'
import StorgeUtil, { ADDRESS_KEY, CONNECT_KEY } from '@/utils/StorgeUtil'
const { ethereum } = window

const Home = () => {
  const successDialogRef = useRef<ElementRef<typeof SuccessDialog>>(null)
  const alert = useAlert()
  const [connected, setConnectStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState(
    sessionStorage.getItem(ADDRESS_KEY) || ''
  )
  const [backuped, setBackuped] = useState(false)
  const [network, setNetwork] = useState({} as NetworkItem)
  const [balance, setBalance] = useState('')
  const [txRecord, setTxRecord] = useState<TxRecordItem[]>([])
  const [createVisible, setCreateVisible] = useState(false)
  const [importVisible, setImportVisible] = useState(false)
  const [exportVisible, setExportVisible] = useState(false)
  const timer = useRef<any>()
  const heartTimer = useRef<any>()

  useEffect(() => {
    init()

    return () => {
      clearInterval(timer.current)
      clearInterval(heartTimer.current)
    }
  }, [])

  const init = async () => {
    if (!(await isFlaskEnable())) return
    if (sessionStorage.getItem(CONNECT_KEY)) {
      setConnectStatus(true)
      getData()
      loopBalance()
      return
    }
  }

  const getData = async () => {
    console.log('getData')

    // @ts-ignore
    const res = await Promise.all([getAddress(), getNetwork()])

    getTxRecord(res)
    getBackuped()
  }

  const getBackuped = async () => {
    const res = await queryBackupStatus()
    if (res.success) {
      console.log('backuped', res.backuped)

      setBackuped(res.backuped)
    }
  }
  const getTxRecordKey = ([addr, cId]) => `x-tx-${cId}-${addr}`
  const getTxRecord = ([addr, cId]) => {
    const list = StorgeUtil.get(getTxRecordKey([addr, cId]), true) ?? []
    setTxRecord(list)
  }

  const getNetwork = async () => {
    if (!ethereum) return
    ethereum.on('chainChanged', _chainId => {
      window.location.reload()
    })

    const chainId: string = await ethereum.request({ method: 'eth_chainId' })
    try {
      const chainList = await ethers.utils.fetchJson(
        'https://chainid.network/chains.json'
      )

      const chainInfo = chainList.find(v => v.chainId === parseInt(chainId))
      console.log(chainInfo)

      setNetwork({
        name: chainInfo.title || chainInfo.name,
        chainId,
        explorer: !chainInfo.explorers.length
          ? null
          : chainInfo.explorers[0]?.url,
      })
      return chainId
    } catch (error) {
      console.log(error)
      return chainId
    }
  }

  const connectFlask = async () => {
    if (!(await isFlaskEnable())) return
    setLoading(true)
    connect(({ success, message }) => {
      setLoading(false)
      if (success) {
        setConnectStatus(true)
        sessionStorage.setItem(CONNECT_KEY, 'true')
        getData()
        loopBalance()
      } else {
        alert(message)
      }
    })
  }

  const getAddress = async () => {
    const cachedAddress = sessionStorage.getItem(ADDRESS_KEY)
    if (cachedAddress) {
      console.log('cachedAddress')

      setAddress(cachedAddress)
      getBalance(cachedAddress)
      return cachedAddress
    } else {
      const res = await requestAccount()
      console.log(res)
      if (res.success && res.address) {
        setAddress(res.address)
        sessionStorage.setItem(ADDRESS_KEY, res.address)
        getBalance(res.address)
        return res.address
      }
      return ''
    }
  }

  const getBalance = async (addr: string) => {
    if (!provider) return
    if (!address) return
    const res = await provider.getBalance(addr)
    console.log('getBalance', res.toString())

    setBalance(res.toString())
  }

  const loopBalance = () => {
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      getBalance(address)
    }, 30 * 1000)
  }

  const startHeartBeat = () => {
    stopHeartBeat()
    heartTimer.current = setInterval(() => {
      heartBeat()
    }, 20 * 1000)
  }

  const stopHeartBeat = () => {
    clearInterval(heartTimer.current)
  }

  const handleCreateComplete = (addr: string) => {
    stopHeartBeat()
    sessionStorage.setItem(ADDRESS_KEY, addr)
    setAddress(addr)
    setCreateVisible(false)
    loopBalance()
    successDialogRef.current?.open('Wallet Created!')
  }

  const handleCreateCancel = () => {
    stopHeartBeat()
    setCreateVisible(false)
  }

  const handleDeleteComplete = () => {
    sessionStorage.setItem(ADDRESS_KEY, '')
    setAddress('')
  }

  const handleImportComplete = (addr: string) => {
    setImportVisible(false)
    setAddress(addr)
    sessionStorage.setItem(ADDRESS_KEY, addr)
    getBalance(addr)
    setBackuped(true)
  }

  const handleExportComplete = () => {
    setBackuped(true)
  }

  const handleSendComplete = (txHash: string) => {
    stopHeartBeat()
    const TXRECODE_KEY = getTxRecordKey([address, network.chainId])
    const list = StorgeUtil.get(TXRECODE_KEY, true) ?? []
    const newList = [...list, { txHash }]
    setTxRecord(newList)
    StorgeUtil.set(TXRECODE_KEY, JSON.stringify(newList), true)
    successDialogRef.current?.open('Success!')
  }

  const isFlaskEnable = async () => {
    if (!ethereum) return false
    const version: string = await ethereum.request({
      method: 'web3_clientVersion',
    })

    return version.includes('flask')
  }

  return (
    <>
      <Loading loading={loading} />
      {!!address && !backuped && (
        <Alert severity="warning">
          Important! MPC Wallet not backed up! Click{' '}
          <Link
            sx={{ cursor: 'pointer', textDecoration: 'none' }}
            onClick={() => setExportVisible(true)}
          >
            here
          </Link>{' '}
          to back up.
        </Alert>
      )}
      <Container fixed style={{ paddingTop: 20 }}>
        <Header connected={connected} onConnect={connectFlask} />
        {connected ? (
          <div>
            <Box sx={{ padding: '30px 0' }}>
              <AddressCard
                network={network}
                address={address}
                balance={balance}
                onDelete={handleDeleteComplete}
                onExport={() => setExportVisible(true)}
              />
              <Box m="20px" />
              <Transfer
                network={network}
                address={address}
                onComplete={handleSendComplete}
                startHeartBeat={startHeartBeat}
                stopHeartBeat={stopHeartBeat}
              />
            </Box>
            <TransactionList list={txRecord} explorer={network.explorer} />
            <Box m="20px" />

            {!address && (
              <CreateOrImportGuide
                onCreate={() => {
                  setCreateVisible(true)
                }}
                onImport={() => {
                  setImportVisible(true)
                }}
                startHeartBeat={startHeartBeat}
                stopHeartBeat={stopHeartBeat}
              />
            )}
            {importVisible && (
              <ImportWalletDialog
                onClose={() => setImportVisible(false)}
                onComplete={handleImportComplete}
              />
            )}

            {exportVisible && (
              <ExportWalletDialog
                onClose={() => setExportVisible(false)}
                onComplete={handleExportComplete}
              />
            )}

            {createVisible && (
              <CreateStepDialog
                onClose={handleCreateCancel}
                onComplete={handleCreateComplete}
              />
            )}
          </div>
        ) : (
          <Welcome />
        )}
        <SuccessDialog ref={successDialogRef} />
      </Container>
    </>
  )
}

export default Home

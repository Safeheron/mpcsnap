import { heartbeat } from '../../src/rpc/heartbeat'

describe('[RPC] heartbeat',  () =>{
  test("should return alived", async () => {
    const result = await heartbeat()
    expect(result).toBe('alived')
  })
})

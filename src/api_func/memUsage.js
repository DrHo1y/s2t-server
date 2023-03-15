import { memoryUsage } from 'node:process'
function memUsage(locate) {
      var m = memoryUsage()
      var mb = 1024 * 1024
      console.log({
          locate: locate,
          rss: (m.rss / mb).toFixed() + 'MB',
          heapTotal: (m.heapTotal / mb).toFixed(0) + 'MB',
          heapUsed: (m.heapUsed / mb).toFixed(0) + 'MB',
          external: (m.external / mb).toFixed(0) + 'MB',
          ArrayBuffers: (m.arrayBuffers / mb).toFixed(0) + 'MB'
      })
}

export { memUsage }
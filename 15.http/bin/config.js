const options = {
  port: {
    option: '-p --port <v>',
    description: 'Port to use [3000]',
    usage: 'hs --port 3000'
  },
  address: {
    option: '-a --address <v>',
    description: 'Address to use [127.0.0.1]',
    usage: 'hs -a 127.0.0.1'
  },
  directory: {
    option: '-d --directory <v>',
    description: 'Show directory listings [true]',
    usage: 'hs -d D:'
  }
}

module.exports = options
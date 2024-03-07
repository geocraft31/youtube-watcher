import functions from "./functions.mjs"

const { list } = functions

function parseArgs(args) {
  const parsedArgs = {}

  for (let i = 0; i < args.length; i++ ){
    const arg = args[i]

    if (arg.startsWith("--")) {
      const key = arg.slice(2)
      const value = args[i + 1]
    
      if (value && !value.startsWith("--")) {
        parsedArgs[key] = value
      } else {
        parsedArgs[key] = true
      }
    }
  }
  return parsedArgs
}

function getFunction(kwargs) {
  
  Object.keys(kwargs).forEach(key => {
    const value = kwargs[key]

    if (key == "list") {
      list(value)
    }
  })
}

function main(args) {
  const kwargs = parseArgs(args)
  getFunction(kwargs)
}

export default main;

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

function main(args) {
  const kwargs = parseArgs(args)
  console.log(kwargs)

}

export default main;
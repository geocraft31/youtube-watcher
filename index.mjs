import { list, add, remove, create, deletePlaylist, play, playlist } from "./functions.mjs"

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


  if (Object.keys(parsedArgs).length == 0 && args.length > 2) {
    args.splice(0, 2)
    parsedArgs["song"] = args
  }

  return parsedArgs
}

function getFunction(kwargs) {

  const func = Object.keys(kwargs)[0]
  const mainArg = kwargs[func]
  delete kwargs[func]

  const remainingArg = kwargs

  if (func == "list")
    list(mainArg, remainingArg)


  if (func == "add")
    add(mainArg, remainingArg)

  if (func == "remove") 
    remove(mainArg, remainingArg)

  if (func == "create") 
    create(mainArg, remainingArg)

  if (func == "delete")
    deletePlaylist(mainArg, remainingArg)

  if (func == "song")
    play(mainArg, remainingArg)

  if (func == "playlist")
    playlist(mainArg, remainingArg)
}

function main(args) {
  const kwargs = parseArgs(args)
  getFunction(kwargs)
}

export default main;
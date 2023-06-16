const FileType = import('file-type')
import fs from 'fs'
import Logging from 'library/Logging'
import { diskStorage, Options } from 'multer'
import { extname } from 'path'

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'

const validFileExtensions: validFileExtensionsType[] = ['png', 'jpg', 'jpeg']
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg']

export const saveImageToStorage: Options = {
  storage: diskStorage({
    destination: './files',
    filename(req, file, callback) {
      //create unique suffix
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      //get file extension
      const ext = extname(file.originalname)
      //write filename
      const filename = `${uniqueSuffix}${ext}`

      callback(null, filename)
    },
  }),
  fileFilter(req, file, callback) {
    const allowedMimeTypes: validMimeType[] = validMimeTypes
    allowedMimeTypes.includes(file.mimetype as validMimeType) ? callback(null, true) : callback(null, false)
  },
}

export const isFileExtensionSafe = async (fullFilePath: string): Promise<boolean> => {
  // console.log(`preverja file`)

  return (await FileType).fileTypeFromFile(fullFilePath).then((fileExtensionAndMimeType) => {
    if (!fileExtensionAndMimeType?.ext) return false

    const isFileTypeLegit = validFileExtensions.includes(fileExtensionAndMimeType.ext as validFileExtensionsType)
    const isMimeTypeLegit = validMimeTypes.includes(fileExtensionAndMimeType.mime as validMimeType)
    const isFileLegit = isFileTypeLegit && isMimeTypeLegit
    // console.log(`vrne: ${fileExtensionAndMimeType.ext} ${JSON.stringify(validMimeTypes)} ${isFileTypeLegit}`)
    return isFileLegit
  })
}

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath)
  } catch (error) {
    Logging.error(error)
  }
}

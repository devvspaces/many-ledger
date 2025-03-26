import { toaster } from '@/components/ui/toaster';
import { FileUploadFileRejectDetails } from '@chakra-ui/react';
import { FileError } from '@zag-js/file-utils';


export function handleFileReject(v: FileUploadFileRejectDetails) {
  for (const file of v.files) {
    for (const err of file.errors) {
      toaster.create({
        description: resolveFileUploadErrorMsg(err),
        type: "error",
      })
    }
  }
}

export function resolveFileUploadErrorMsg(error: FileError) {
  switch (error) {
    case 'FILE_INVALID':
      return 'The file uploaded is not a valid file';
    case 'FILE_INVALID_TYPE':
      return 'The uploaded file is not among accepted file types'
    case 'FILE_TOO_LARGE':
      return 'File uploaded is too large'
    case 'FILE_TOO_SMALL':
      return 'File uploaded is too small'
    case 'TOO_MANY_FILES':
      return 'The amount of files uploaded exceed the maximum acceptable files'
    default:
      return `Error uploading file: ${error}`
  }
}
import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';
 
const DIRS    = RNFetchBlob.fs.dirs
const DIR_VIDEO  = DIRS.DownloadDir
const DIR_IMAGE  = DIRS.DownloadDir
const DIR_PDF = DIRS.DownloadDir
 
//Check and Make Dir
// RNFetchBlob.fs.isDir(DIR_VIDEO)
// .then((isDir) => {
//   console.log(isDir)
//   if(isDir){
//     console.log('Yuhu '+isDir)
//   }else{
//     RNFetchBlob.fs.mkdir(DIR_VIDEO)
//     .then(() => { console.log('success') })
//     .catch((err) => { console.log(err) })
//   }
// })
 
// RNFetchBlob.fs.isDir(DIR_IMAGE)
// .then((isDir) => {
//   console.log(isDir)
//   if(isDir){
//     console.log('Yuhu '+isDir)
//   }else{
//     RNFetchBlob.fs.mkdir(DIR_IMAGE)
//     .then(() => { console.log('success') })
//     .catch((err) => { console.log(err) })
//   }
// })
 
export async function downloadVideo(url) {
  try {
    return await RNFetchBlob.config({
      fileCache : true,
      addAndroidDownloads : {
        useDownloadManager : true,
        //notification: false,
        title: 'Download video',
        path: `${DIR_VIDEO}/${new Date().getTime()}.mp4`,
        mime: 'video/mp4',
        description: 'Downloading...',
      }
    })
    .fetch('GET', url)
  } catch(err) {
    console.error(err)
  }
}

export async function downloadPdf(url) {
  try {
    return await RNFetchBlob.config({
      path: DIR_PDF,
      addAndroidDownloads : {
          useDownloadManager : true, // <-- this is the only thing required
          // Optional, override notification setting (default to true)
          notification : true,
          // Optional, but recommended since android DownloadManager will fail when
          // the url does not contains a file extension, by default the mime type will be text/plain
          //mime : 'application/pdf',
          //description : 'File downloaded by download manager.'
      }
    })
    .fetch('GET', url)
  } catch(err) {
    console.error(err)
  }
}
 
export async function downloadImage(url) {
  try {
    return await RNFetchBlob.config({
      fileCache : true,
      overwrite: true,
      indicator: true,
      path: `${DIR_IMAGE}/${new Date().getTime()}.jpg`,
    })
    .fetch('GET', url)
  } catch(err) {
    console.error(err)
  }
}
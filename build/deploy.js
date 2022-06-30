const path = require('path')
const node_ssh = require('node-ssh')
const ssh = new node_ssh()
const fs = require('fs')
const archiver = require('archiver')
const moment = require('moment')

if (!process.env.JAVAPRO_SSH_HOST) {
  console.error('Please set ENV variables JAVAPRO_SSH_{HOST,LOGIN,PASSWORD}')
  return
}

console.log('Uploading to ' + process.env.JAVAPRO_SSH_HOST)

const sshConnection = ssh.connect({
  host: process.env.JAVAPRO_SSH_HOST,
  username: process.env.JAVAPRO_SSH_LOGIN,
  password: process.env.JAVAPRO_SSH_PASSWORD
})

Promise.all([prepareZip(), sshConnection])
  .then(sshUpload)
  .then(sshSymlink)
  .then(file => {
    console.log('SUCCESS!')
    console.log(`Written to ${file}!`)
  })
  .catch(e => {
    console.log(e)
  })
  .finally(() => {
    ssh.dispose()
  })

function prepareZip() {
  return new Promise((success, error) => {
    const arhiveFile = path.resolve(__dirname + '/../dist.zip')
    var output = fs.createWriteStream(arhiveFile)
    var archive = archiver('zip')
    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes written to ' + arhiveFile)
      success(arhiveFile)
    })
    archive.on('error', function(err) {
      error(err)
    })

    // pipe archive data to the file
    archive.pipe(output)
    archive.directory(path.resolve(__dirname, '../dist'), false).finalize()
  })
}

function sshUpload([zipFile, sshHandle]) {
  return new Promise((success, error) => {
    const postfix = moment().format('YYYY-MM-DD-HHmm')
    const uploadedFilePath = `/home/javapro/frontend/releases/dist-${postfix}.zip`
    sshHandle.putFile(zipFile, uploadedFilePath).then(
      function() {
        console.log('The File thing is done')
        success([uploadedFilePath, sshHandle])
      },
      function(err) {
        console.log("Something's wrong")
        error(err)
      }
    )
  })
}
function sshSymlink([uploadedFilePath, sshHandle]) {
  return new Promise((success, error) => {
    sshHandle
      .exec('ln -sf', [uploadedFilePath, '/home/javapro/frontend/latest-release.zip'])
      .then(function(result) {
        success(uploadedFilePath)
      })
      .catch(error)
  })
}

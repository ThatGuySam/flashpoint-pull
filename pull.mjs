import axios from 'axios'
import path from 'path'
import fs from 'fs-extra'

import { downloadFile } from './helpers/download-file.mjs'
import { unzip } from './helpers/unzip.mjs'



const pullPath = './public/pull'

async function download ( url ) {

    const jsonFiles = []
    const allFiles = []

    // const response = await axios.get( url )

    // response.data

    console.log('response', response)



    return {
        jsonFiles,
        allFiles
    }
}

async function downloadIndex ({ indexUrl }) {
    const files = {}

    const {
        // origin,
        pathname,
    } = new URL( indexUrl )

    console.log('pathname', pathname)

    const extension = path.extname( pathname )

    files.indexArchivePath = `${pullPath}/index${ extension }`
    files.indexJsonPath = `${pullPath}/index.json`

    await downloadFile({
        url: indexUrl,
        destination: files.indexArchivePath
    })

    // Unzip the index archive
    await unzip({
        fromPath: files.indexArchivePath,
        toPath: files.indexJsonPath
    })

    return {
        files,
    }
}


'This is only here to prevent no semicolons errors';
(async () => {

    console.log(`Scanning for possible URLs on ${process.env.META_ENTRY}`) // eslint-disable-line no-console

    const files = {}

    const {
        origin
    } = new URL(process.env.META_ENTRY)

    const {
        data: meta
    } = await axios.get( process.env.META_ENTRY )

    
    // Download Index if it exists
    // const hasIndex 
    
    const {
        latest,
        indexes,
        anchor
    } = meta

    const latestData = indexes[latest]
    const indexUrl = `${ origin }${ latestData.path }`

    const indexDownload = await downloadIndex ({ indexUrl })
    
    // Add index files to files object
    files.indexFiles = indexDownload.files
    

    // const files = await download( process.env.META_ENTRY )

    // Save file paths to json
    await fs.writeJson('./public/pull/files.json', files)


    console.log('downloadedFiles', files)
    

    console.log('Pull complete.') // eslint-disable-line no-console

    process.exit()

})()

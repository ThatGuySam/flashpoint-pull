import fs from 'fs-extra'
import path from 'path'

import StreamZip from 'node-stream-zip'
import lzma from 'lzma-native'

// console.log('lzma', lzma)

export function unxz({
    fromPath, 
    toPath
}) {
    return new Promise((resolve, reject) => {
        var compressor = lzma.createDecompressor();
        var input = fs.createReadStream( fromPath );
        var output = fs.createWriteStream( toPath );


        output.on("finish", () => {
            resolve( toPath )
        })

        output.on("error", err => {
            output.close()

            if (err.code === "EEXIST") {
                reject("XZ output file already exists")
            } else {
                fs.unlink(toPath, () => {}) // Delete temp file
                reject(err.message)
            }
        })

        // Start decompression stream
        input.pipe(compressor).pipe(output)
    })
}


export async function unzip ({
    fromPath, 
    toPath
}) {

    const extension = path.extname( fromPath )

    // Detect and decompress xz archive
    if (extension === '.xz') {

        console.log(`Detected XZ Decompressing`) // eslint-disable-line no-console

        await unxz({
            fromPath,
            toPath
        })

        console.log(`XZ Decompression finished. `) // eslint-disable-line no-console

        return
    }

    // console.log('fromPath', fromPath)
    // console.log('toPath', toPath)

    const zip = new StreamZip.async({ file: fromPath })

    // await intializePublishDirectory()

    const count = await zip.extract(null, toPath)
    console.log(`Extracted ${count} entries`) // eslint-disable-line no-console

    await zip.close()

    return
}

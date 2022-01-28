// import dotenv from 'dotenv'
import download from 'download'
import { createWriteStream, promises as fs } from 'fs'
import ProgressBar from 'progress'




// Setup dotenv
// dotenv.config()


// https://stackoverflow.com/a/45007624/1397641
export function downloadFile ({
    destination, 
    url,
}) {
    let transferred = null

    return new Promise((resolve, reject) => {
        const file = createWriteStream(destination, { flags: "wx" });

        console.log('\nConnecting …\n') // eslint-disable-line no-console

        const request = download( url, {
            // headers: {
            //     'Authorization': wpAuthHeader
            // }
        } )

        // Track transfer progress
        request.on('downloadProgress', progress => transferred = Number( progress.transferred ) )

        // On the first downloadProgress
        // create a progress bar
        request.once('downloadProgress', progress => {
            // Download progress tracker
            // https://futurestud.io/tutorials/axios-download-progress-in-node-js
            const progressBar = new ProgressBar('-> Downloading [:bar] :percent :etas', {
                width: 40,
                complete: '=',
                incomplete: ' ',
                // renderThrottle: 1,
                total: Number( progress.total )
            })

            const timer = setInterval(() => {
                progressBar.tick( transferred )

                if (progressBar.complete) {
                    console.log(`\nFinished Downloading ${url} \n`) // eslint-disable-line no-console
                    clearInterval(timer)
                }
            }, 50)
        })

        file.on("finish", () => {
            resolve(  )
        })

        file.on("error", err => {
            file.close()

            if (err.code === "EEXIST") {
                reject("File already exists")
            } else {
                fs.unlink(destination, () => {}) // Delete temp file
                reject(err.message)
            }
        })

        // Start streaming requestt data to file
        request.pipe( file )
    })
}









interface JSZipSupport {
    arraybuffer: boolean
    uint8array: boolean
    blob: boolean
    
}

type Compression = 'STORE' | 'DEFLATE'

interface Metadata {
    percent: number
    currentFile: string
}

type OnUpdateCallback = (metadata: Metadata) => void

interface InputByType {
    base64: string
    string: string
    text: string
    binarystring: string
    array: number[]
    uint8array: Uint8Array
    arraybuffer: ArrayBuffer
    blob: Blob
    
}

interface OutputByType {
    base64: string
    text: string
    binarystring: string
    array: number[]
    uint8array: Uint8Array
    arraybuffer: ArrayBuffer
    blob: Blob
    
}

type InputFileFormat = InputByType[keyof InputByType]

declare namespace JSZip {
    type InputType = keyof InputByType

    type OutputType = keyof OutputByType

    interface JSZipObject {
        name: string
        dir: boolean
        date: Date
        comment: string
        
        unixPermissions: number | string | null
        
        dosPermissions: number | null
        options: JSZipObjectOptions

        
        async<T extends OutputType>(
            type: T,
            onUpdate?: OnUpdateCallback
        ): Promise<OutputByType[T]>
        
        
        
        
    }

    interface JSZipFileOptions {
        
        base64?: boolean
        
        binary?: boolean
        
        date?: Date
        compression?: string
        comment?: string
        
        optimizedBinaryString?: boolean
        
        createFolders?: boolean
        
        dir?: boolean

        
        dosPermissions?: number | null
        
        unixPermissions?: number | string | null
    }

    interface JSZipObjectOptions {
        compression: Compression
    }

    interface JSZipGeneratorOptions<T extends OutputType> {
        compression?: Compression
        compressionOptions?: null | {
            level: number
        }
        type?: T
        comment?: string
        
        mimeType?: string
        encodeFileName?(filename: string): string
        
        streamFiles?: boolean
        
        platform?: 'DOS' | 'UNIX'
    }

    interface JSZipLoadOptions {
        base64?: boolean
        checkCRC32?: boolean
        optimizedBinaryString?: boolean
        createFolders?: boolean
    }
}

interface JSZip {
    files: { [key: string]: JSZip.JSZipObject }

    
    file(path: string): JSZip.JSZipObject

    
    file(path: RegExp): JSZip.JSZipObject[]

    
    file<T extends JSZip.InputType>(
        path: string,
        data: InputByType[T] | Promise<InputByType[T]>,
        options?: JSZip.JSZipFileOptions
    ): this
    file<T extends JSZip.InputType>(
        path: string,
        data: null,
        options?: JSZip.JSZipFileOptions & { dir: true }
    ): this

    
    folder(name: string): JSZip

    
    folder(name: RegExp): JSZip.JSZipObject[]

    
    forEach(
        callback: (relativePath: string, file: JSZip.JSZipObject) => void
    ): void

    
    filter(
        predicate: (relativePath: string, file: JSZip.JSZipObject) => boolean
    ): JSZip.JSZipObject[]

    
    remove(path: string): JSZip

    
    generateAsync<T extends JSZip.OutputType>(
        options?: JSZip.JSZipGeneratorOptions<T>,
        onUpdate?: OnUpdateCallback
    ): Promise<OutputByType[T]>

    
    
    
    
    

    
    loadAsync(
        data: InputFileFormat,
        options?: JSZip.JSZipLoadOptions
    ): Promise<JSZip>

    

    
    new (data?: InputFileFormat, options?: JSZip.JSZipLoadOptions): this

    (): JSZip

    prototype: JSZip
    support: JSZipSupport
    external: {
        Promise: PromiseConstructorLike
    }
    version: string
}

declare var JSZip: JSZip


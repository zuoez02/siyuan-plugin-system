import { serverApi } from "@/api"

export const getFile = async (filePath: string) => {
    return serverApi.getFile(filePath);
}

export const writeFile = async (path: string, filedata: string, isDir: boolean) => {
    return serverApi.putFile(path, filedata, isDir);
}

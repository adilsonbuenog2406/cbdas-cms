declare module "ssh2-sftp-client" {
  export type ConnectOptions = {
    host: string;
    port?: number;
    username: string;
    password?: string;
    privateKey?: string;
    passphrase?: string;
    readyTimeout?: number;
    hostHash?: "sha256" | "md5";
    hostVerifier?: (fingerprint: string) => boolean;
  };

  export type FileInfo = {
    name: string;
    type: "d" | "-" | "l";
    size: number;
  };

  export type FileStats = {
    size: number;
  };

  export default class Client {
    connect(options: ConnectOptions): Promise<void>;
    end(): Promise<void>;
    exists(remotePath: string): Promise<false | "d" | "-" | "l">;
    list(remotePath: string): Promise<FileInfo[]>;
    mkdir(remotePath: string, recursive?: boolean): Promise<void>;
    rmdir(remotePath: string): Promise<void>;
    delete(remotePath: string): Promise<void>;
    rename(fromPath: string, toPath: string): Promise<void>;
    fastPut(localPath: string, remotePath: string): Promise<void>;
    stat(remotePath: string): Promise<FileStats>;
    get(remotePath: string): Promise<Buffer>;
    put(input: Buffer | string, remotePath: string): Promise<void>;
  }
}

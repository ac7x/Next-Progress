// src/modules/c-shared/infrastructure/hashClient.ts
import { sha256 } from '@noble/hashes/sha256';

class HashClient {
    // SHA256 加密
    hashData(data: string): string {
        const encoder = new TextEncoder();  // 使用 TextEncoder 将字符串编码为字节数组
        const dataArray = encoder.encode(data); // 将字符串编码成字节数组
        const hash = sha256(dataArray); // 计算哈希
        return Buffer.from(hash).toString('hex'); // 将结果转换为十六进制字符串
    }

    // 你可以扩展其他哈希算法，如 MD5、SHA-512 等
}

export const hashClient = new HashClient();

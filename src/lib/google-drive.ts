export class DriveService {
    private accessToken: string;
    private readonly FILENAME = 'user_profile.json';

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    // Helper for fetch with auth
    private async fetch(url: string, options: RequestInit = {}) {
        const headers = {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error?.message || `Drive API Error: ${response.statusText}`);
        }
        return response;
    }

    // 1. Find the file in appDataFolder
    async findFileId(): Promise<string | null> {
        const query = `name = '${this.FILENAME}' and 'appDataFolder' in parents and trashed = false`;
        const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&spaces=appDataFolder`;

        const res = await this.fetch(url);
        const data = await res.json();

        if (data.files && data.files.length > 0) {
            return data.files[0].id;
        }
        return null;
    }

    // 2. Upload (Create or Update)
    async saveProfile(profileData: any): Promise<void> {
        const fileId = await this.findFileId();
        const fileContent = JSON.stringify(profileData);
        const fileMetadata = {
            name: this.FILENAME,
            parents: ['appDataFolder'],
        };

        if (fileId) {
            // Update existing file
            await this.fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
                method: 'PATCH',
                body: fileContent,
            });
        } else {
            // Create new file
            // Direct metadata+content upload is complex with fetch, simplifying to two steps or multipart
            // Easiest for JSON: Create metadata then upload content, or use multipart.
            // Let's use multipart/related for a single request if possible, or creates simple file then update media

            // Create new file with compliant multipart/related
            const multipartBoundary = 'northern_aurora_boundary';
            const delimiter = `\r\n--${multipartBoundary}\r\n`;
            const closeDelim = `\r\n--${multipartBoundary}--`;

            const body =
                `--${multipartBoundary}\r\n` +
                'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
                JSON.stringify(fileMetadata) +
                delimiter +
                'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
                fileContent +
                closeDelim;

            await this.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/related; boundary=${multipartBoundary}`
                },
                body
            });
        }
    }

    // 3. Download
    async loadProfile(): Promise<any> {
        const fileId = await this.findFileId();
        if (!fileId) return null;

        const res = await this.fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`);
        return await res.json();
    }
}

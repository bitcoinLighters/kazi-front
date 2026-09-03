export const fileService = {
  async upload(_file: File): Promise<string> {
    throw new Error('File uploads are not configured yet. Connect fileService.upload to your storage provider.');
  },
};
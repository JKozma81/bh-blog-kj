class ArchiveConfigService {
  constructor(ArchiveRepository) {
    this.ArchiveRepository = ArchiveRepository;
  }

  async getAllLayouts() {
    return await this.ArchiveRepository.getAllLayout();
  }

  async modifyLayout(layout) {
    return await this.ArchiveRepository.modifyLayout(layout);
  }

  async getDefaultLayout() {
    return await this.ArchiveRepository.getDefault();
  }
}

module.exports = ArchiveConfigService;

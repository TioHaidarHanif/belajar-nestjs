import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { AuthGuard } from '@nestjs/passport';

const mockMember = { id: 1, username: 'user1', role: 'member' };
const mockAdmin = { id: 2, username: 'admin', role: 'admin' };
const mockArticle: Article = {
  id: 1,
  title: 'Judul Artikel',
  content: 'Isi artikel',
  createdAt: new Date(),
  updatedAt: new Date(),
  user: mockMember as any,
};

const mockArticleService = {
  findAll: jest.fn().mockResolvedValue([mockArticle]),
  findOne: jest.fn().mockResolvedValue(mockArticle),
  create: jest.fn().mockResolvedValue(mockArticle),
  update: jest.fn().mockResolvedValue(mockArticle),
  remove: jest.fn().mockResolvedValue(true),
};

describe('ArticleController', () => {
  let controller: ArticleController;
  let service: ArticleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        { provide: ArticleService, useValue: mockArticleService },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ArticleController>(ArticleController);
    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all articles', async () => {
    expect(await controller.findAll()).toEqual([mockArticle]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return an article by id', async () => {
    expect(await controller.findOne('1')).toEqual(mockArticle);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create an article', async () => {
    const dto = { title: 'Judul Artikel', content: 'Isi artikel' };
    const req = { user: mockMember } as any;
    expect(await controller.create(dto, req)).toEqual(mockArticle);
    expect(service.create).toHaveBeenCalledWith(dto.title, dto.content, mockMember);
  });

  it('should update an article as member (own article)', async () => {
    const dto = { title: 'Baru' };
    const req = { user: mockMember } as any;
    expect(await controller.update('1', dto, req)).toEqual(mockArticle);
    expect(service.update).toHaveBeenCalledWith(1, dto, mockMember);
  });

  it('should update an article as admin (any article)', async () => {
    const dto = { title: 'Baru' };
    const req = { user: mockAdmin } as any;
    expect(await controller.update('1', dto, req)).toEqual(mockArticle);
    expect(service.update).toHaveBeenCalledWith(1, dto, mockAdmin);
  });

  it('should remove an article as member (own article)', async () => {
    const req = { user: mockMember } as any;
    expect(await controller.remove('1', req)).toEqual({ success: true });
    expect(service.remove).toHaveBeenCalledWith(1, mockMember);
  });

  it('should remove an article as admin (any article)', async () => {
    const req = { user: mockAdmin } as any;
    expect(await controller.remove('1', req)).toEqual({ success: true });
    expect(service.remove).toHaveBeenCalledWith(1, mockAdmin);
  });
});

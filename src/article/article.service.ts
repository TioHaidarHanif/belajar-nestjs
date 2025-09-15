import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  findAll(): Promise<Article[]> {
    return this.articleRepository.find();
  }

  findOne(id: number): Promise<Article | null> {
    return this.articleRepository.findOneBy({ id });
  }

  create(title: string, content: string, user: User): Promise<Article> {
    const article = this.articleRepository.create({ title, content, user });
    return this.articleRepository.save(article);
  }

  async update(id: number, data: Partial<Article>, user: User): Promise<Article | null> {
    const article = await this.articleRepository.findOne({ where: { id }, relations: ['user'] });
    if (!article) return null;
    if (user.role !== 'admin' && article.user.id !== user.id) return null;
    await this.articleRepository.update(id, data);
    return this.articleRepository.findOneBy({ id });
  }

  async remove(id: number, user: User): Promise<boolean> {
    const article = await this.articleRepository.findOne({ where: { id }, relations: ['user'] });
    if (!article) return false;
    if (user.role !== 'admin' && article.user.id !== user.id) return false;
    await this.articleRepository.delete(id);
    return true;
  }
}

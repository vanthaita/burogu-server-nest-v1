import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {DatabaseService} from '../database/database.service'
import { ResponseData } from '../global/globalClass';
import { HttpMessage, HttpStatus } from '../global/globalEmun';
@Injectable()
export class PostService {
    constructor(private readonly databaseService: DatabaseService) {}
    async create(createPostDto: CreatePostDto) {
      // check if the post has already been created
      const postExists = await this.databaseService.post.findFirst({
        where: { title: createPostDto.title },
      });
      console.log(postExists, "post exists");
      if (postExists) {
        return new ResponseData(null, HttpStatus.CONFLICT, HttpMessage.ERROR_CONFLICT)
      }
      // create the post
      const post = await this.databaseService.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          authorId: createPostDto.authorId,
          // category: createPostDto.category,
        },
        select: {
          id: true,
          title: true,
          content: true,
          authorId: true,
          // category: true,
        },
      })
      return new ResponseData(post, HttpStatus.CREATED, HttpMessage.SUCCESS_CREATED);
    }

    async findAll() {
      const allPost = await this.databaseService.post.findMany() 
      return new ResponseData(allPost, HttpStatus.SUCCESS, HttpMessage.SUCCESS_LISTED);
    }

    async findOne(id: number) {
      const post = await this.databaseService.post.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          authorId: true,
          // category: true,
        },
      });
      console.log(post);

      if (!post) {
        return new ResponseData(null, HttpStatus.NOT_FOUND, HttpMessage.ERROR_NOT_FOUND);
      }
      return new ResponseData(post, HttpStatus.SUCCESS, HttpMessage.SUCCESS_OK);
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
      const post = await this.databaseService.post.update({
        where: { id },
        data: updatePostDto,
      });
      if (!post) {
        return new ResponseData(null, HttpStatus.NOT_FOUND, HttpMessage.ERROR_NOT_FOUND);
      }
      return new ResponseData(post, HttpStatus.SUCCESS, HttpMessage.SUCCESS_UPDATED);
    }

    async remove(id: number) {
      const post = await this.databaseService.post.update({
        where: { id },
        data: {
          delete: true,
        }
      });
      if (!post) {
        return new ResponseData(null, HttpStatus.NOT_FOUND, HttpMessage.ERROR_NOT_FOUND);
      }
      return new ResponseData(post, HttpStatus.SUCCESS, HttpMessage.SUCCESS_DELETED);
    }
}

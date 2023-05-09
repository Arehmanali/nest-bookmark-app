import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmarkDTO) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return {
      success: true,
      message: 'New Bookmark Created!',
      bookmark,
    };
  }

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });

    return {
      success: true,
      message: 'Bookmarks Fetched!',
      bookmarks,
    };
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId: userId,
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access Denied!');

    return {
      success: true,
      message: 'Bookmark Fetched!',
      bookmark,
    };
  }

  async editBookmarkById(
    userId: number,
    dto: EditBookmarkDTO,
    bookmarkId: number,
  ) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resouce denied');

    return {
      success: true,
      message: 'Bookmark Updated!',
      bookmark: await this.prisma.bookmark.update({
        where: {
          id: bookmarkId,
        },
        data: {
          ...dto,
        },
      }),
    };
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resouce denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });

    return {
      success: true,
      message: 'Bookmark Deleted!',
    };
  }
}

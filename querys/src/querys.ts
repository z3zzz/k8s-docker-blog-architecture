import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';

type CommentStatus = 'approved' | 'rejected' | 'pending';

interface Comment {
  id: string;
  content: string;
  status: CommentStatus;
}

interface EventComment {
  postId: string;
  id: string;
  content: string;
  status: CommentStatus;
}

interface Post {
  id: string;
  title: string;
  comments: Comment[];
}

interface EventPost {
  id: string;
  title: string;
}

interface GetPosts {
  Reply: Post[];
}

interface PostEvent {
  Body: {
    eventType: 'PostCreated' | 'CommentCreated' | 'CommentUpdated';
    eventData: EventPost | EventComment;
  };
  Reply: {
    result: 'success';
  };
}

const posts: Post[] = [];

export async function queryRoutes(
  router: FastifyInstance,
  options: FastifyPluginOptions
) {
  const opts: { [keys: string]: RouteShorthandOptions } = {};

  // json schema for data validation
  opts['get-posts'] = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              comments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    content: { type: 'string' },
                    status: {
                      type: 'string',
                      pattern: '(approved|rejected|pending)',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  router.get<GetPosts>('/posts', opts['get-posts'], async (req, res) => {
    return posts;
  });

  opts['post-event'] = {
    schema: {
      body: {
        type: 'object',
        properties: {
          eventType: {
            type: 'string',
          },
          eventData: {
            type: 'object',
            anyOf: [
              {
                properties: {
                  postId: { type: 'string' },
                  id: { type: 'string' },
                  content: { type: 'string' },
                },
              },
              {
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                },
              },
            ],
          },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            result: { type: 'string', pattern: 'success' },
          },
        },
      },
    },
  };

  router.post<PostEvent>('/event', opts['post-event'], async (req, res) => {
    const { eventType, eventData } = req.body;

    console.log({ eventType, eventData });

    if (eventType === 'PostCreated') {
      const newPost = eventData as EventPost;

      posts.push({ ...newPost, comments: [] });
    }

    if (eventType === 'CommentCreated') {
      const newComment = eventData as EventComment;
      const commentedPost = posts.find((post) => post.id === newComment.postId);

      if (commentedPost) {
        commentedPost.comments.push(newComment);
      }
    }

    if (eventType === 'CommentUpdated') {
      const updatedComment = eventData as EventComment;
      const { id, postId } = updatedComment;

      const post = posts.find((post) => post.id === postId);

      console.log({ post });

      if (!post) return;

      const commentIndex = post.comments.findIndex(
        (comment) => comment.id === id
      );

      console.log({ commentIndex });

      if (commentIndex === -1) return;

      post.comments[commentIndex] = updatedComment;
      console.log({
        'post.comments[commentIndex]': post.comments[commentIndex],
      });
    }

    res.code(201);
    return { result: 'success' };
  });
}

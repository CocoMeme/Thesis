const ForumPost = require('../models/ForumPost');
const User = require('../models/User');

/**
 * Forum Controller
 * Handles all forum post CRUD operations
 */

// Get all forum posts with filters
exports.getAllPosts = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      tags, 
      sortBy = 'recent', 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    const query = { status: 'active' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'recent':
        sort = { createdAt: -1 };
        break;
      case 'popular':
        sort = { likes: -1, createdAt: -1 };
        break;
      case 'mostCommented':
        sort = { comments: -1, createdAt: -1 };
        break;
      case 'views':
        sort = { views: -1, createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const posts = await ForumPost.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username firstName lastName email emailVerified')
      .populate('comments.user', 'username firstName lastName email emailVerified')
      .lean();

    // Get total count for pagination
    const total = await ForumPost.countDocuments(query);

    // Format posts
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      ...post,
      author: {
        username: post.author?.username || (post.author?.firstName && post.author?.lastName ? `${post.author.firstName} ${post.author.lastName}` : post.author?.email?.split('@')[0]) || 'Anonymous',
        verified: post.author?.emailVerified || false,
      },
      likeCount: post.likes?.length || 0,
      commentCount: post.comments?.length || 0,
      timestamp: getRelativeTime(post.createdAt),
    }));

    res.status(200).json({
      success: true,
      data: formattedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasMore: skip + posts.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum posts',
      error: error.message,
    });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findById(id)
      .populate('author', 'username firstName lastName email emailVerified')
      .populate('comments.user', 'username firstName lastName email emailVerified')
      .populate('likes.user', 'username firstName lastName');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    // Format response
    const formattedPost = {
      ...post.toObject(),
      author: {
        username: post.author?.username || (post.author?.firstName && post.author?.lastName ? `${post.author.firstName} ${post.author.lastName}` : post.author?.email?.split('@')[0]) || 'Anonymous',
        verified: post.author?.emailVerified || false,
      },
      likes: post.likes?.length || 0,
      comments: post.comments?.map(comment => ({
        ...comment.toObject(),
        user: {
          username: comment.user?.username || (comment.user?.firstName && comment.user?.lastName ? `${comment.user.firstName} ${comment.user.lastName}` : comment.user?.email?.split('@')[0]) || 'Anonymous',
          verified: comment.user?.emailVerified || false,
        },
        likes: comment.likes?.length || 0,
        timestamp: getRelativeTime(comment.createdAt),
      })) || [],
      timestamp: getRelativeTime(post.createdAt),
    };

    res.status(200).json({
      success: true,
      data: formattedPost,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error.message,
    });
  }
};

// Create new post
exports.createPost = async (req, res) => {
  try {
    const { category, title, content, tags, image } = req.body;
    const userId = req.user._id;

    console.log('Creating post - User ID:', userId);
    console.log('Creating post - User object:', req.user);

    // Validate required fields
    if (!category || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Category, title, and content are required',
      });
    }

    // Validate category
    const validCategories = ['tips', 'questions', 'showcase', 'discussion'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }

    // Create post
    const post = new ForumPost({
      author: userId,
      category,
      title,
      content,
      tags: tags || [],
      image: image || null,
    });

    await post.save();

    // Populate author info
    await post.populate('author', 'username firstName lastName email emailVerified');

    console.log('Post created - Author after populate:', post.author);

    // Format response
    const formattedPost = {
      ...post.toObject(),
      author: {
        username: post.author?.username || (post.author?.firstName && post.author?.lastName ? `${post.author.firstName} ${post.author.lastName}` : post.author?.email?.split('@')[0]) || 'Anonymous',
        verified: post.author?.emailVerified || false,
      },
      likeCount: 0,
      commentCount: 0,
      relativeTime: 'Just now',
    };

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: formattedPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message,
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, image } = req.body;
    const userId = req.user._id;

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts',
      });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (image !== undefined) post.image = image;

    await post.save();
    await post.populate('author', 'username firstName lastName email emailVerified');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      error: error.message,
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts',
      });
    }

    // Soft delete
    post.status = 'deleted';
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message,
    });
  }
};

// Like/Unlike post
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user already liked
    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === userId.toString()
    );

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push({ user: userId });
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      data: {
        likes: post.likes.length,
        isLiked: likeIndex === -1,
      },
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like',
      error: error.message,
    });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'This post is locked and cannot receive new comments',
      });
    }

    // Add comment
    post.comments.push({
      user: userId,
      content: content.trim(),
    });

    await post.save();
    await post.populate('comments.user', 'username firstName lastName email emailVerified');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        ...newComment.toObject(),
        user: {
          username: newComment.user?.username || (newComment.user?.firstName && newComment.user?.lastName ? `${newComment.user.firstName} ${newComment.user.lastName}` : newComment.user?.email?.split('@')[0]) || 'Anonymous',
          avatar: newComment.user?.photoURL || null,
          verified: newComment.user?.emailVerified || false,
        },
        timestamp: 'Just now',
      },
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message,
    });
  }
};

// Get popular topics/tags
exports.getPopularTopics = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Aggregate tags from all active posts
    const topics = await ForumPost.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) },
    ]);

    const formattedTopics = topics.map(topic => ({
      name: topic._id,
      count: topic.count,
    }));

    res.status(200).json({
      success: true,
      data: formattedTopics,
    });
  } catch (error) {
    console.error('Error fetching popular topics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular topics',
      error: error.message,
    });
  }
};

// Helper function for relative time
function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

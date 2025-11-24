# Forum Report/Flag Feature

## Overview
Users can now report inappropriate posts in the community forum. Reported posts are flagged for admin review.

## Implementation Summary

### Frontend Changes

#### 1. **CommunityScreen.js**
- Added report button to post footer with flag icon
- Implemented `handleReportPost` function with confirmation dialog
- Added Alert feedback on successful report submission
- Updated post footer styles to accommodate report button

#### 2. **forumService.js**
- Added `reportPost(postId)` function
- Sends POST request to `/api/forum/posts/:postId/report`
- Returns success/error response to UI

### Backend Changes

#### 1. **forumController.js**
- Added `reportPost` endpoint handler
- Validates post exists
- Prevents users from reporting their own posts
- Changes post status to 'flagged'
- Returns confirmation message

#### 2. **forum.js Routes**
- Added `POST /posts/:id/report` route
- Protected with authentication middleware

## User Flow

1. User views a post in Community Forum
2. User taps flag icon button on post
3. Confirmation dialog appears: "Report this post for inappropriate content? Our moderators will review it."
4. User confirms report
5. Post status changes to 'flagged'
6. User receives confirmation: "Your report has been submitted. Our team will review this post shortly."
7. Post is removed from active feed (status changed to 'flagged')
8. Admin can view flagged posts in Forum Management screen

## Admin Review Flow

1. Admin navigates to Forum Management screen
2. Selects "Flagged" filter to view all reported posts
3. Reviews flagged content
4. Can take actions:
   - **Approve**: Changes status back to 'active' (post was fine)
   - **Reject**: Changes status to 'rejected' (inappropriate content confirmed)
   - **Delete**: Soft deletes the post (status = 'deleted')
   - **Lock**: Prevents further comments

## API Endpoints

### Report Post
```
POST /api/forum/posts/:id/report
Authorization: Required (JWT token)
```

**Success Response:**
```json
{
  "success": true,
  "message": "Post has been reported. Our moderators will review it shortly."
}
```

**Error Cases:**
- Post not found (404)
- Reporting own post (400)
- Server error (500)

## Business Rules

1. **Authentication Required**: Only logged-in users can report posts
2. **Cannot Report Own Posts**: Users cannot flag their own content
3. **Single Report Effect**: Reporting a post immediately changes its status to 'flagged'
4. **Status Change**: Flagged posts are hidden from public view
5. **Admin-Only Review**: Only admins can view and moderate flagged posts

## Security Considerations

- JWT authentication required for reporting
- Prevents self-reporting abuse
- Post validation before status change
- Error handling for all edge cases

## Future Enhancements (Optional)

- Track who reported each post
- Allow multiple reports before flagging
- Add report reasons/categories
- Notify post author when flagged
- Track report history
- Implement auto-moderation for multiple reports
- Add appeals process for flagged content

## Testing Checklist

- [x] Report button visible on all posts
- [x] Confirmation dialog displays correctly
- [x] Success message shows after report
- [x] Post disappears from feed after flagging
- [x] Admin can see flagged posts
- [x] Cannot report own posts
- [x] Error handling works correctly

## Related Files

**Frontend:**
- `frontend/mobile-app/src/screens/ForumScreens/CommunityScreen.js`
- `frontend/mobile-app/src/services/forumService.js`

**Backend:**
- `backend/src/controllers/forumController.js`
- `backend/src/routes/forum.js`
- `backend/src/models/ForumPost.js` (status field)

## Complete Feature Set

The forum management system now includes:
1. ✅ Post moderation (pending approval workflow)
2. ✅ Pin functionality with filters
3. ✅ Flag/report functionality
4. ✅ Lock posts (prevent comments)
5. ✅ Soft delete (preserve data)
6. ✅ Admin dashboard statistics
7. ✅ User's own posts view

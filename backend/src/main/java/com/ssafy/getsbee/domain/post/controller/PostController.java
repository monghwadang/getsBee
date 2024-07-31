package com.ssafy.getsbee.domain.post.controller;

import com.ssafy.getsbee.domain.post.dto.request.PostListRequest;
import com.ssafy.getsbee.domain.post.dto.request.UpdatePostRequest;
import com.ssafy.getsbee.domain.post.dto.response.PostListResponse;
import com.ssafy.getsbee.domain.post.dto.response.PostResponse;
import com.ssafy.getsbee.domain.post.service.PostService;
import com.ssafy.getsbee.global.error.ErrorCode;
import com.ssafy.getsbee.global.error.exception.BadRequestException;
import com.ssafy.getsbee.global.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import static com.ssafy.getsbee.global.error.ErrorCode.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/{post-id}")
    public PostResponse showPostInfo(@PathVariable("post-id") Long postId){
        return postService.showPostInfo(postId, SecurityUtil.getCurrentMemberId());

    }

    @PatchMapping("/{post-id}")
    public void updatePost(@PathVariable("post-id") Long postId, @RequestBody @Valid UpdatePostRequest updatePostRequest) {
        postService.updatePost(postId, updatePostRequest, SecurityUtil.getCurrentMemberId());
    }

    @DeleteMapping("/{post-id}")
    public void deletePost(@PathVariable("post-id") Long postId) {
        postService.deletePost(postId, SecurityUtil.getCurrentMemberId());
    }

    @PostMapping("/{post-id}/bookmarks")
    public void addBookmark(@PathVariable("post-id") Long postId) {
        postService.addBookmark(postId, SecurityUtil.getCurrentMemberId());
    }

    @DeleteMapping("/{post-id}/bookmarks")
    public void deleteBookmark(@PathVariable("post-id") Long postId) {
        postService.deleteBookmark(postId, SecurityUtil.getCurrentMemberId());
    }

    @PostMapping("/{post-id}/likes")
    public void likePost(@PathVariable("post-id") Long postId){
        postService.likePost(postId, SecurityUtil.getCurrentMemberId());
    }

    @DeleteMapping("/{post-id}/likes")
    public void unlikePost(@PathVariable("post-id") Long postId){
        postService.likePost(postId, SecurityUtil.getCurrentMemberId());
    }

    @GetMapping("/")
    public List<PostListResponse> showPostList(PostListRequest postListRequest){
        if(postListRequest.directoryId() != null){

        }else if(postListRequest.memberId() != null){

        }else if(postListRequest.following()!=null){

        }else if(postListRequest.query()!=null){
            //가현이 검색 로직
        }else{
            throw new BadRequestException(INVALID_POST_REQUEST);
        }
        return null;
    }
}

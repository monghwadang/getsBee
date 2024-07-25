package com.ssafy.getsbee.domain.highlight.dto.request;

import com.ssafy.getsbee.domain.directory.entity.Directory;
import com.ssafy.getsbee.domain.highlight.entity.Highlight;
import com.ssafy.getsbee.domain.highlight.entity.Type;
import com.ssafy.getsbee.domain.member.entity.Member;
import com.ssafy.getsbee.domain.post.entity.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateHighlightRequest (
        @NotNull
        String url,
        String thumbnailUrl,
        @NotNull
        String title,
        @NotNull
        String content,
        @NotNull
        String color,
        @NotNull
        Integer startIndex,
        @NotNull
        Integer startOffset,
        @NotNull
        Integer lastIndex,
        @NotNull
        Integer lastOffset,
        @NotNull
        Type type
) {
    public Post toPostEntity(Member member, Directory directory) {
        return Post.builder()
                .title(title)
                .url(url)
                .thumbnailUrl(thumbnailUrl)
                .member(member)
                .directory(directory)
                .build();
    }

    public Highlight toHighlightEntity(Post post) {
        return Highlight.builder()
                .content(content)
                .color(color)
                .startIndex(startIndex)
                .startOffset(startOffset)
                .lastIndex(lastIndex)
                .lastOffset(lastOffset)
                .type(type)
                .isDeleted(false)
                .post(post)
                .build();
    }
}

package com.ssafy.getsbee.domain.post.entity;

import com.ssafy.getsbee.domain.directory.entity.Directory;
import com.ssafy.getsbee.domain.highlight.entity.Highlight;
import com.ssafy.getsbee.domain.member.entity.Member;
import com.ssafy.getsbee.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

import static jakarta.persistence.FetchType.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE post SET is_deleted = true WHERE post_id = ?")
@SQLRestriction("is_deleted = false")
public class Post extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(length = 2083, nullable = false)
    private String url;

    @Column(columnDefinition = "longtext")
    private String note;

    @Column(name = "thumbnail_url", length = 2083)
    private String thumbnailUrl;

    @Column(name = "is_public", columnDefinition = "tinyint(1) not null default 0")
    private Boolean isPublic;

    @Column(name = "view_count", columnDefinition = "bigint not null default 0")
    private Long viewCount;

    @Column(name = "like_count", columnDefinition = "bigint not null default 0")
    private Long likeCount;

    @Column(name = "bookmark_count", columnDefinition = "bigint not null default 0")
    private Long bookmarkCount;

    @Column(name = "is_deleted", columnDefinition = "tinyint(1) not null default 0")
    private Boolean isDeleted;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Highlight> highlights;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "directory_id")
    private Directory directory;

    public Post(Long id, String title, String url, String note, String thumbnailUrl, Boolean isPublic, Long viewCount, Long likeCount, Long bookmarkCount, Boolean isDeleted, Member member, List<Highlight> highlights, Directory directory) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.note = note;
        this.thumbnailUrl = thumbnailUrl;
        this.isPublic = isPublic;
        this.viewCount = viewCount;
        this.likeCount = likeCount;
        this.bookmarkCount = bookmarkCount;
        this.isDeleted = isDeleted;
        this.member = member;
        this.highlights = highlights;
        this.directory = directory;
    }

    @Builder
    public Post(String title, String url, String thumbnailUrl, Member member, Directory directory) {
        this.title = title;
        this.url = url;
        this.thumbnailUrl = thumbnailUrl;
        this.isPublic = true;
        this.viewCount = 0L;
        this.likeCount = 0L;
        this.bookmarkCount = 0L;
        this.isDeleted = false;
        this.member = member;
        this.directory = directory;
    }

    public void updatePost (String note, Directory directory, Boolean isPublic){
        this.note = note;
        this.directory = directory;
        this.isPublic = isPublic;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }
}

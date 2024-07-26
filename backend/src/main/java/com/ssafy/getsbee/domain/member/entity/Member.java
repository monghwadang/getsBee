package com.ssafy.getsbee.domain.member.entity;

import com.ssafy.getsbee.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Where;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE member SET is_deleted = true WHERE member_id = ?")
@SQLRestriction("is_deleted = false")
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(length = 320, nullable = false)
    private String email;

    @Column(length = 10, nullable = false)
    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column(columnDefinition = "varchar(10) not null default 'ROLE_USER'")
    @Enumerated(EnumType.STRING)
    private Authority authority;

    @Column(name = "birth_year")
    private Integer birthYear;

    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private Job job;

    @Column(length = 2083)
    private String profile;

    @Column(length = 73)
    private String name;

    @Column(name = "is_deleted", columnDefinition = "tinyint(1) not null default 0")
    private Boolean isDeleted;

    @Builder
    public Member(Long id, String email, Provider provider, Authority authority, Integer birthYear, Job job,
                  String profile, String name, Boolean isDeleted) {
        this.id = id;
        this.email = email;
        this.provider = provider;
        this.authority = authority;
        this.birthYear = birthYear;
        this.job = job;
        this.profile = profile;
        this.name = name;
        this.isDeleted = isDeleted;
    }
}

export const UserRolesEnum = {
    ADMIN: "admin",
    USER: "user"
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const PostStatusEnum = {
    DRAFT: "draft",
    PENDING: "pending",
    Approved: "approved",
    REJECTED: "rejected",
    PUBLISHED: "published"
};

export const AvailablePostStatus = Object.values(PostStatusEnum);
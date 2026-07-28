package com.nieldave.fittrackpro.mapper;

import com.nieldave.fittrackpro.dto.user.UserResponse;
import com.nieldave.fittrackpro.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);
}

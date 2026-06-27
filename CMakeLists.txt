cmake_minimum_required(VERSION 3.10)
project(abscomsvg VERSION 0.2.963 LANGUAGES NONE)

add_custom_target(build
  COMMAND npm run build
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  COMMENT "Build AbscomSVG with tsup"
)

add_custom_target(test
  COMMAND bun test
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  COMMENT "Run tests with Bun"
)

add_custom_target(typecheck
  COMMAND npm run typecheck
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  COMMENT "Type-check with tsc"
)

add_custom_target(clean
  COMMAND rm -rf dist/
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  COMMENT "Remove build artifacts"
)

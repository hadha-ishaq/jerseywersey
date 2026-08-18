import React from "react"

import { IconProps } from "types/icon"

const Search: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M19.0002 19.0002L13.8036 13.8036M15.8889 8.94444C15.8889 12.7794 12.7794 15.8889 8.94444 15.8889C5.10949 15.8889 2 12.7794 2 8.94444C2 5.10949 5.10949 2 8.94444 2C12.7794 2 15.8889 5.10949 15.8889 8.94444Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Search
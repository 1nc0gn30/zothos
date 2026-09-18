#!/bin/bash

# Path to the data.json file
DATA_FILE="src/data/data.json"

# Function to add a new blog entry to the JSON file
add_blog() {
  local id="$1"
  local seoLogo="$2"
  local seoTitle="$3"
  local seoIntro="$4"
  local seoCta="$5"
  local seoExternalLink="$6"
  local seoServiceCta="$7"
  local pageId="$8"
  shift 8
  local seoDescription=()
  local seoAdditionalBody=()
  local in_description=true

  for arg in "$@"; do
    if [[ $arg == "--" ]]; then
      in_description=false
      continue
    fi
    if $in_description; then
      [[ -n $arg ]] && seoDescription+=("$arg")
    else
      [[ -n $arg ]] && seoAdditionalBody+=("$arg")
    fi
  done

  # Convert arrays to JSON arrays
  seoDescription_json=$(printf '%s\n' "${seoDescription[@]}" | jq -R -s -c 'split("\n") | map(select(. != ""))')
  seoAdditionalBody_json=$(printf '%s\n' "${seoAdditionalBody[@]}" | jq -R -s -c 'split("\n") | map(select(. != ""))')

  # Create a new blog entry JSON object
  new_blog_entry=$(jq -n \
    --arg id "$id" \
    --arg seoLogo "$seoLogo" \
    --arg seoTitle "$seoTitle" \
    --arg seoIntro "$seoIntro" \
    --argjson seoDescription "$seoDescription_json" \
    --argjson seoAdditionalBody "$seoAdditionalBody_json" \
    --arg seoCta "$seoCta" \
    --arg seoExternalLink "$seoExternalLink" \
    --arg seoServiceCta "$seoServiceCta" \
    --arg pageId "$pageId" \
    '{
      id: $id,
      seoLogo: $seoLogo,
      seoTitle: $seoTitle,
      seoIntro: $seoIntro,
      seoDescription: $seoDescription,
      seoAdditionalBody: $seoAdditionalBody,
      seoCta: $seoCta,
      seoExternalLinks: [$seoExternalLink],
      seoServiceCta: $seoServiceCta,
      pageId: $pageId
    }')

  # Append the new blog entry to the data.json file
  jq ". += [$new_blog_entry]" "$DATA_FILE" > "${DATA_FILE}.tmp" && mv "${DATA_FILE}.tmp" "$DATA_FILE"
}

# Function to get the highest ID in the JSON file
get_highest_id() {
  jq -r 'map(.id | tonumber) | max' "$DATA_FILE"
}

# Function to get blog details from the user
get_blog_details() {
  local highest_id=$(get_highest_id)
  local tempfile=$(mktemp)

  # Initialize form fields
  local form_fields=(
    --field="ID" \
    --field="SEO Logo" \
    --field="SEO Title" \
    --field="SEO Intro" \
  )
  for i in $(seq 1 10); do
    form_fields+=("--field=SEO Description Line $i")
  done
  for i in $(seq 1 4); do
    form_fields+=("--field=SEO Additional Body Line $i")
  done
  form_fields+=(
    --field="SEO CTA" \
    --field="SEO External Link" \
    --field="SEO Service CTA" \
    --field="Page ID" \
  )

  # Show GUI to get blog details from the user and display current blogs
  yad --title="Blog Management" --width=1200 --height=800 --form --separator="|" --split \
    --scroll \
    "${form_fields[@]}" \
    --button="Add Blog:0" \
    --button="Highest ID: $highest_id:1" \
    --right > "$tempfile"

  # Read the form result
  blog_details=$(<"$tempfile")
  rm -f "$tempfile"

  # Return the form result
  echo "$blog_details"
}

# Main menu function
main_menu() {
  while true; do
    local blog_details=$(get_blog_details)

    # Check which button was clicked
    button_clicked=$?

    # Check if the user canceled the input
    if [[ -z "$blog_details" ]]; then
      exit 1
    fi

    if [[ $button_clicked -eq 1 ]]; then
      continue
    else
      # Split the user input into individual variables
      IFS="|" read -r id seoLogo seoTitle seoIntro seoDescription1 seoDescription2 seoDescription3 seoDescription4 seoDescription5 seoDescription6 seoDescription7 seoDescription8 seoDescription9 seoDescription10 seoAdditionalBody1 seoAdditionalBody2 seoAdditionalBody3 seoAdditionalBody4 seoCta seoExternalLink seoServiceCta pageId <<< "$blog_details"

      local seoDescription=()
      local seoAdditionalBody=()

      for desc in "$seoDescription1" "$seoDescription2" "$seoDescription3" "$seoDescription4" "$seoDescription5" \
                  "$seoDescription6" "$seoDescription7" "$seoDescription8" "$seoDescription9" "$seoDescription10"; do
        [[ -n $desc ]] && seoDescription+=("$desc")
      done

      for body in "$seoAdditionalBody1" "$seoAdditionalBody2" "$seoAdditionalBody3" "$seoAdditionalBody4"; do
        [[ -n $body ]] && seoAdditionalBody+=("$body")
      done

      # Confirm the blog entry with the user
      yad --question --title="Confirm Blog Entry" --text="Are you sure you want to add this blog entry?"

      if [[ $? -eq 0 ]]; then
        add_blog "$id" "$seoLogo" "$seoTitle" "$seoIntro" "$seoCta" "$seoExternalLink" "$seoServiceCta" "$pageId" "${seoDescription[@]}" "--" "${seoAdditionalBody[@]}"
        yad --info --title="Success" --text="Blog entry added successfully!"
        exit 0  # Close after successful post
      else
        yad --info --title="Cancelled" --text="Blog entry was not added."
      fi
    fi
  done
}

# Start the main menu
main_menu

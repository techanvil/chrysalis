#!/bin/sh

repo_root=$( cd "$( dirname "$0}" )"/.. && pwd )

. "$repo_root/.env.local"

npx -y get-graphql-schema --header "Authorization=Bearer $ZENHUB_API_KEY" https://api.zenhub.com/public/graphql/ > "$repo_root/zenhub-schema.graphql"

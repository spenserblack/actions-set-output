FROM ruby:2.7

# Setup dependencies for entrypoint
RUN bundle config --global frozen 1
WORKDIR /usr/src/app
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Access user's repo
WORKDIR /github/workspace

# Setup entrypoint
COPY bin/action /entrypoint
ENTRYPOINT ["/entrypoint"]

=begin
  Jekyll filter to concatenate arrays
  Usage:
    {% assign result = array-1 | concat: array-2 %}
=end
module Jekyll
  module ToHash
    def to_hash(input)
      input.map do |doc|
        {url: doc.url}
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::ToHash)

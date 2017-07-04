---
layout: page
title: Blog
search_omit: true
---

{% assign posts = site.posts | concat: site.data.external-posts | sort: 'date' | reverse %}

<ul>
  {% for post in posts  %}
    <li>
      {% if post.origin == 'u2i' %}
        <img src="{{ site.url }}/images/u2i.png" style="width: 25px; height: 25px" />
      {% endif %}
      <a href="{{ post.url }}" {% if post.url contains 'http' %}target="_blank"{% endif %}>{{ post.title }} ({{ post.date | date: "%Y-%m-%d" }})</a>
    </li>
  {% endfor %}
</ul>

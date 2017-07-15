---
layout: page
title: Blog
search_omit: true
---

Home posts:

<ul>
  {% assign home_posts = site.posts | sort: 'date' | reverse %}
  {% for post in home_posts %}
    {% if post.published == false %}
      {% continue %}
    {% endif %}
    <li>
      <a href="{{ post.url }}" {% if post.url contains 'http' %}target="_blank"{% endif %}>{{ post.title }} ({{ post.date | date: "%Y-%m-%d" }})</a>
    </li>
  {% endfor %}
</ul>


External posts:

<ul>
  {% assign external_posts = site.data.external-posts | sort: 'date' | reverse %}
  {% for post in external_posts %}
    <li>
      {% if post.origin == 'u2i' %}
        <img src="{{ site.url }}/images/u2i.png" style="width: 25px; height: 25px" />
      {% endif %}
      <a href="{{ post.url }}" {% if post.url contains 'http' %}target="_blank"{% endif %}>{{ post.title }} ({{ post.date | date: "%Y-%m-%d" }})</a>
    </li>
  {% endfor %}
</ul>

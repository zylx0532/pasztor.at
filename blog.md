---
title: Blog
layout: wall
description: Read the IT blog of Janos Pasztor
---

{% assign posts = site.categories.blog | where_exp:"post","post.date < site.time" %}
<div class="wall">
<div class="wall__postlist">
{% for post in posts offset:0 limit:8 %}
{% include wall-post.html %}
{% endfor %}
{% for post in posts offset:8 %}
{% include wall-post-noimage.html %}
{% endfor %}
</div>
</div>

---
layout: page
title: STIG Library
description: DoD STIG implementation notes and hardening guides collected from supported security platforms.
---
<div class="guide-list big">{% assign stigs = site.guides | where: 'category', 'STIG' %}{% for guide in stigs %}<a href="{{ guide.url | relative_url }}"><span>{{ guide.project }}</span><strong>{{ guide.title }}</strong><p>{{ guide.description }}</p></a>{% endfor %}</div>
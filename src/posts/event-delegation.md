---
path: "/event-delegation"
title: "What is Event Delegation in JavaScript?"
date: "2018-09-11"
published: true
slug: event-delegation
---

### What is event bubbling?

Web browsers need an algorithm for managing events that happen on the DOM. For
example, the browser listens for the user clicking the mouse, and when the
mouse is clicked, an event is fired off which contains the information about
that action. For example, the action was of 'click' type, and the user clicked
on an anchor tag element.

Event bubbling describes a behavior of web browsers, where when an event is
fired, the event cascades up the DOM hierarchy.

If we picture the DOM as a giant family tree, when something happens to one
child, that child tells its parent what happened, and then that parent tells
its parent, and so on. Any event listeners that are attached to DOM elements in
the ancestry chain can react to events happening further down the family tree.
This is not only a very convenient way of managing behavior happening in an
application, because it allows for one listener to react to many events. But it
also helps work with common problems seen in UI programming, where elements may
be added and removed from the page dynamically (and even after the initial page
load), so we need a dynamic way to handle those events.

### How does this tie into event delegation?

Event delegation is one way we can take advantage of event bubbling. Let's say
when you click on an individual element in a list, we want to display the text
of the element clicked in a message paragraph tag.

```html
<p id="message">Here is a message</p>

<ul id="list">
  <li>Hi there</li>
  <li>Hello</li>
  <li>Hello again</li>
</ul>
```

We could add 3 separate event listeners to each item in the list. However, this
can become cumbersome, and imagine our list may grow in the future, or we load
items dynamically from a database. We would need to loop through all the items
in the list and add an event listener to every one, and make sure to re-loop
every time a new item is added or removed from the list.

Taking advantage of how the browser handles event bubbling, you can get the
same behavior by adding a single event handler on a common ancestor, which can
listen to events that bubble up from its children:

```js
const messageElement = document.querySelector("#message");
document
  .querySelector("#list")
  .addEventListener(
    "click",
    (event) => (messageElement.innerText = event.target.innerText)
  );
```

Reducing the number of event listeners in your code is a good practice! For
further reading, see these links below:

### Further reading

- [MDN - Introduction to events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
- [How JavaScript Event Delegation Works](https://davidwalsh.name/event-delegate)

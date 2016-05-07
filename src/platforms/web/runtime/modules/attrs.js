import { isBooleanAttr, isEnumeratedAttr, isXlink, xlinkNS, getXlinkProp } from 'web/util/index'

function updateAttrs (oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  let key, cur, old
  const elm = vnode.elm
  const oldAttrs = oldVnode.data.attrs || {}
  const attrs = vnode.data.attrs || {}

  for (key in attrs) {
    cur = attrs[key]
    old = oldAttrs[key]
    if (old !== cur) {
      setAttr(elm, key, cur)
    }
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key))
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key)
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (value == null || value === false) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, key)
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, value ? 'true' : 'false')
  } else if (isXlink(key)) {
    if (value == null || value === false) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key))
    } else {
      el.setAttributeNS(xlinkNS, key, value === true ? '' : value)
    }
  } else {
    if (value == null || value === false) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, value === true ? '' : value)
    }
  }
}

export default {
  create: function (_, vnode) {
    const attrs = vnode.data.staticAttrs
    if (attrs) {
      for (const key in attrs) {
        if (!vnode.elm) debugger
        setAttr(vnode.elm, key, attrs[key])
      }
    }
    updateAttrs(_, vnode)
  },
  update: updateAttrs
}

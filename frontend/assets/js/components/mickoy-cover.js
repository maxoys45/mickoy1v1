/**
 * Mickoy Cover
 * ------------------------------------------------------------------------------
 * Component for showing and hiding the mickoy cover on page change.
 *
 * @namespace mickoyCover
 */
import { on } from '../helpers/utils'
import cssClasses from '../helpers/cssClasses'

/**
 * Global variables
 */
const selectors = {
  cover: '[mickoy-cover]',
  mainLinks: '[mickoy-cover-link]',
}

export default () => {

  /**
   * Node selectors
   */
  const nodes = {
    cover: document.querySelector(selectors.cover),
    mainLinks: [...document.querySelectorAll(selectors.mainLinks)],
  }

  /**
   * Set listeners
   */
  function setListeners() {
    nodes.mainLinks.forEach(link => {
      on('click', link, (e) => {
        e.preventDefault()
        pageTransition(link)
      })
    })
  }

  const pageTransition = async (link) => {
    await showCover()

    gotoPage(link)
  }

  /**
   * Hide the mickoy cover.
   */
  const hideCover = () => {
    setTimeout(() => {
      nodes.cover.classList.remove(cssClasses.active)
    }, 150)
  }

  /**
   * Show the mickoy cover.
   */
  const showCover = () => {
    nodes.cover.classList.add(cssClasses.active)

    return new Promise(resolve => {
      nodes.cover.ontransitionend = () => {
        resolve(nodes.cover)
      }
    })
  }

  /**
   * Goto the requested page once the animation has played.
   */
  const gotoPage = (link) => {
    window.location.href = link.getAttribute('href')
  }

  /**
   * Initialise component
   */
  function init() {
    setListeners()
    hideCover()
  }

  return Object.freeze({
    init,
  })
}
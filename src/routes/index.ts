import { createPlaywrightRouter } from 'crawlee'
import { detail } from './detail'
import { category } from './category'
import { start } from './start'

export const router = createPlaywrightRouter()

router.addHandler('DETAIL', detail)
router.addHandler('CATEGORY', category)
router.addDefaultHandler(start)

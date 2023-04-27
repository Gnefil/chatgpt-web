import fs from 'fs/promises'

const auth = async (req, res, next) => {
  const authConfig = await readAuthConfig()
  if (Object.keys(authConfig).length > 0) {
    try {
      const Authorization = req.header('Authorization')
      if (!Authorization)
        throw new Error('Error: 无访问权限 | No access rights')
      const token = Authorization.replace('Bearer ', '').trim()
      if (!(token in authConfig && authConfig[token].allow))
        throw new Error('Error: 无访问权限 | No access rights')
      next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    next()
  }
}

async function readAuthConfig() {
  const fileContents = await fs.readFile('auth.json', 'utf8').catch(() => '{}')
  return JSON.parse(fileContents)
}

export { auth, readAuthConfig }

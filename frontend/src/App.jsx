import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

const API_URL = 'http://localhost:8000/api'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [view, setView] = useState('login')
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [companies, setCompanies] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [cvFile, setCvFile] = useState(null)

  useEffect(() => {
    if (token) {
      fetchJobs()
      if (user?.role === 'employer') {
        fetchApplications()
        fetchCompanies()
      }
    }
  }, [token, user])

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` }
  })

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get('/jobs/')
      setJobs(res.data.results || res.data)
    } catch (err) {
      console.error('Error fetching jobs:', err)
    }
  }

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get('/employer-applications/')
      setApplications(res.data.results || res.data)
    } catch (err) {
      console.error('Error fetching applications:', err)
    }
  }

  const fetchCompanies = async () => {
    try {
      const res = await axiosInstance.get('/companies/')
      setCompanies(res.data.results || res.data)
    } catch (err) {
      console.error('Error fetching companies:', err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const username = e.target.username.value
    const password = e.target.password.value

    try {
      const res = await axios.post(`${API_URL}/token/`, { username, password })
      setToken(res.data.access)
      localStorage.setItem('token', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      setUser({ username, role: password.includes('emp') ? 'employer' : 'applicant' })
      setView('jobs')
    } catch (err) {
      alert('Login failed')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const username = e.target.username.value
    const password = e.target.password.value
    const role = e.target.role.value

    try {
      await axios.post(`${API_URL}/register/`, { username, password, role })
      alert('Registration successful! Please login.')
      setView('login')
    } catch (err) {
      alert('Registration failed')
    }
  }

  const handleApply = async (jobId) => {
    setSelectedJob(jobId)
    setShowApplyForm(true)
  }

  const submitApplication = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('job', selectedJob)
    formData.append('cover_letter', coverLetter)
    if (cvFile) {
      formData.append('cv', cvFile)
    }

    try {
      await axiosInstance.post('/applications/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      alert('Application submitted successfully!')
      setShowApplyForm(false)
      setCoverLetter('')
      setCvFile(null)
      setSelectedJob(null)
    } catch (err) {
      alert('Application failed. Please try again.')
    }
  }

  const handleStatusUpdate = async (appId, status) => {
    try {
      await axiosInstance.patch(`/employer-applications/${appId}/`, { status })
      fetchApplications()
    } catch (err) {
      alert('Status update failed')
    }
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    setView('login')
  }

  if (!token) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
          <h1>{view === 'login' ? 'Login' : 'Register'}</h1>
          <form onSubmit={view === 'login' ? handleLogin : handleRegister}>
            <input name="username" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            {view === 'register' && (
              <select name="role">
                <option value="applicant">Applicant</option>
                <option value="employer">Employer</option>
              </select>
            )}
            <button type="submit">{view === 'login' ? 'Login' : 'Register'}</button>
          </form>
          <button onClick={() => setView(view === 'login' ? 'register' : 'login')} style={{ background: 'transparent', color: '#ffd700', marginTop: '10px' }}>
            {view === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', color: 'var(--accent)', fontWeight: 600 }}>Job Board</h1>
          {token && (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); setView('profile') }}>Resume and profile</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setView('applications') }}>Responses</a>
              <a href="#">Help</a>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {token ? (
            <>
              <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>{user?.username}</span>
              <button onClick={handleLogout} className="secondary">Logout</button>
            </>
          ) : (
            <button onClick={() => setView('register')}>Create Resume</button>
          )}
        </div>
      </nav>

      <div className="container">
        <div className="layout">
          <aside className="sidebar">
            <div className="sidebar-section">
              <h3>Your activity</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '13%' }}></div>
              </div>
              <a href="#" className="sidebar-link">Responses and suggestions <span className="count">7</span></a>
              <a href="#" className="sidebar-link">Resume views <span className="count">6</span></a>
              <a href="#" className="sidebar-link">Selected vacancies</a>
              <a href="#" className="sidebar-link">Automatic search</a>
            </div>
            <div className="sidebar-section">
              <h3>Promote resume in search</h3>
              <a href="#" className="sidebar-link">Promote</a>
            </div>
          </aside>

          <main className="main-content">
            <div style={{ marginBottom: '20px' }}>
              <button onClick={() => setView('jobs')}>Jobs</button>
              <button onClick={() => setView('profile')}>Profile</button>
              {user?.role === 'employer' && (
                <>
                  <button onClick={() => setView('companies')}>Companies</button>
                  <button onClick={() => setView('post-job')}>Post Job</button>
                  <button onClick={() => setView('applications')}>Applications</button>
                </>
              )}
            </div>

        {view === 'jobs' && (
          <div>
            <div className="search-section">
              <div className="search-bar">
                <input type="text" placeholder="Profession, position or company" />
                <button className="secondary">Filters</button>
                <button>Search</button>
              </div>
            </div>

            <h2>Available Jobs</h2>
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p className="salary">${job.salary}</p>
                <p className="location">{job.location}</p>
                <p className="company">{job.company_name || job.company}</p>
                <p className="description">{job.description}</p>
                {user?.role === 'applicant' && (
                  <button onClick={() => handleApply(job.id)}>Respond</button>
                )}
              </div>
            ))}

            {showApplyForm && (
              <div className="card apply-form">
                <h3>Apply for Job</h3>
                <form onSubmit={submitApplication}>
                  <textarea
                    placeholder="Cover Letter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                    rows="5"
                  />
                  <div className="file-upload" onClick={() => document.getElementById('cv-upload').click()}>
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files[0])}
                    />
                    <p>{cvFile ? cvFile.name : 'Click to upload CV (PDF, DOC, DOCX)'}</p>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <button type="submit">Submit Application</button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        setShowApplyForm(false)
                        setCoverLetter('')
                        setCvFile(null)
                        setSelectedJob(null)
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {view === 'profile' && (
          <div className="profile-section">
            <h2>My Profile</h2>
            <div className="profile-info">
              <div className="profile-item">
                <div className="profile-label">Username</div>
                <div className="profile-value">{user?.username}</div>
              </div>
              <div className="profile-item">
                <div className="profile-label">Role</div>
                <div className="profile-value">{user?.role}</div>
              </div>
              <div className="profile-item">
                <div className="profile-label">Account Type</div>
                <div className="profile-value">{user?.role === 'employer' ? 'Employer' : 'Applicant'}</div>
              </div>
            </div>
          </div>
        )}

        {view === 'companies' && user?.role === 'employer' && (
          <div>
            <h2>My Companies</h2>
            <div className="card">
              <h3>Add Company</h3>
              <form onSubmit={async (e) => {
                e.preventDefault()
                try {
                  await axiosInstance.post('/companies/', {
                    name: e.target.name.value,
                    description: e.target.description.value,
                    location: e.target.location.value
                  })
                  fetchCompanies()
                  e.target.reset()
                } catch (err) {
                  alert('Failed to add company')
                }
              }}>
                <input name="name" placeholder="Company Name" required />
                <input name="description" placeholder="Description" />
                <input name="location" placeholder="Location" required />
                <button type="submit">Add Company</button>
              </form>
            </div>
            {companies.map(company => (
              <div key={company.id} className="card">
                <h3>{company.name}</h3>
                <p>{company.description}</p>
                <p>Location: {company.location}</p>
              </div>
            ))}
          </div>
        )}

        {view === 'post-job' && user?.role === 'employer' && (
          <div>
            <h2>Post Job</h2>
            <div className="card">
              <form onSubmit={async (e) => {
                e.preventDefault()
                try {
                  await axiosInstance.post('/jobs/', {
                    company: e.target.company.value,
                    title: e.target.title.value,
                    description: e.target.description.value,
                    salary: e.target.salary.value,
                    location: e.target.location.value
                  })
                  fetchJobs()
                  setView('jobs')
                  e.target.reset()
                } catch (err) {
                  alert('Failed to post job')
                }
              }}>
                <select name="company" required>
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
                <input name="title" placeholder="Job Title" required />
                <textarea name="description" placeholder="Job Description" required />
                <input name="salary" type="number" placeholder="Salary" required />
                <input name="location" placeholder="Location" required />
                <button type="submit">Post Job</button>
              </form>
            </div>
          </div>
        )}

        {view === 'applications' && user?.role === 'employer' && (
          <div>
            <h2>Applications</h2>
            {applications.map(app => (
              <div key={app.id} className="card">
                <h3>{app.applicant_username || app.applicant}</h3>
                <p>Job: {app.job_title || app.job}</p>
                <p>Cover Letter: {app.cover_letter}</p>
                <p className={`status-${app.status}`}>Status: {app.status}</p>
                {app.status === 'pending' && (
                  <div>
                    <button onClick={() => handleStatusUpdate(app.id, 'accepted')}>Accept</button>
                    <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="secondary">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
          </main>
        </div>
      </div>
    </>
  )
}

export default App

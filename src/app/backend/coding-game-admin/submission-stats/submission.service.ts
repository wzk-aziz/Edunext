getSubmissionsCountByProblem(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stats/by-problem`);
  }
  
  getBestScoresByStudent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stats/best-scores`);
  }
  
  getAllSortedSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.baseUrl}/stats/all-sorted`);
  }
  
import pandas as pd

class SpreadsheetManager:
    def __init__(self):
        self.sheet_id = "1xZ9LxyzAbCDEFGhijkLmNOPqrSTUvWxyz1234567890"

        self.sheet_url = f"https://docs.google.com/spreadsheets/d/e/2PACX-1vS4_Drx9X6aFc_38FvItxjOEFDDQoFytlmkmnKJ-JllcpR2sskKOUexjbibZ-EivMI-55cgbD-v0TgL/pub?gid=0&single=true&output=csv"

    def _load_data(self):
        return pd.read_csv(self.sheet_url)

    def get_all_employees(self):
        return self._load_data().to_dict(orient='records')

    def find_employee_by_phone(self, phone_number):
        df = self._load_data()
        match = df[df['phone_no'].astype(str) == str(phone_number)]
        if match.empty:
            return None
        return match.iloc[0].to_dict()
spreadsheet=SpreadsheetManager()
import pandas as pd

# Load the dataset from the provided file
file_path = 'data.xlsx'
xls = pd.ExcelFile(file_path)

# Load the necessary sheet for Scene 1
data_prevalence_depression = pd.read_excel(xls, sheet_name='prevalence-by-mental-and-substa')

# Filter data for the most recent year
most_recent_year = data_prevalence_depression['Year'].max()
data_most_recent = data_prevalence_depression[data_prevalence_depression['Year'] == most_recent_year]

# Select relevant columns and rename for clarity
data_most_recent = data_most_recent[['Entity', 'Depression (%)']]
data_most_recent.columns = ['Country', 'Depression']

# Save to CSV for use in JavaScript
data_most_recent.to_csv('data_depression_most_recent.csv', index=False)

data_most_recent.head()

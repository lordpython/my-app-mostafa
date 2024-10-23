import tkinter as tk
from tkinter import filedialog
from tkinter import messagebox
import os

# Function to get all files from the selected folder
def get_files_from_folder(folder_path):
    # Define which file types to include
    valid_extensions = ('.js', '.tsx', '.ts', '.txt', '.json', '.css', '.html', '.md', '.py', '.sh', '.yml', '.xml', '.yaml', '.mdx', '.tsconfig', '.gitignore', '.env', '.jsonc' )  # Add other extensions if needed
    files = []
    
    # Walk through the folder and get files with valid extensions
    for root, dirs, filenames in os.walk(folder_path):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')  # Ignore node_modules directories
        for filename in filenames:
            if filename.endswith(valid_extensions) and filename != 'package-lock.json':
                files.append(os.path.join(root, filename))
    
    return files

# Function to combine files
def combine_files():
    # Ask if the user wants to select files or a folder
    choice = messagebox.askyesno("Select Mode", "Would you like to select a folder instead of individual files?")
    
    if choice:  # If the user selects 'Yes', open a folder dialog
        folder_path = filedialog.askdirectory(title="Select folder to combine files from")
        if not folder_path:
            messagebox.showwarning("No Folder Selected", "Please select a folder!")
            return
        file_paths = get_files_from_folder(folder_path)
        if not file_paths:
            messagebox.showwarning("No Valid Files", "No valid files found in the selected folder!")
            return
    else:
        # Open file dialog to select multiple files
        file_types = [
            ("JavaScript Files", "*.js"),
            ("TypeScript JSX Files", "*.tsx"),
            ("TypeScript Files", "*.ts"),
            #combine types of all codes file here
            ("All Files", "*.*")
        ]
        file_paths = filedialog.askopenfilenames(title="Select files to combine", filetypes=file_types)
    
    if not file_paths:
        messagebox.showwarning("No Files Selected", "Please select at least one file!")
        return

    # Ask for the output file path
    output_file_path = filedialog.asksaveasfilename(defaultextension=".txt", title="Save Combined File As", filetypes=[("Text Files", "*.txt")])
    
    if not output_file_path:
        messagebox.showwarning("No Output File", "Please provide a name for the output file!")
        return

    try:
        with open(output_file_path, 'w') as outfile:
            for file_path in file_paths:
                relative_path = os.path.relpath(file_path)
                outfile.write(f"File: {relative_path}\n")  # Write relative path
                outfile.write("-" * 50 + "\n")  # Separator line before content
                with open(file_path, 'r', encoding="utf-8", errors="ignore") as infile:
                    outfile.write(infile.read())  # Write the content of each file
                    outfile.write("\n" + "-" * 50 + "\n")  # Separator line between files
        messagebox.showinfo("Success", f"Files combined successfully into {output_file_path}")
    except Exception as e:
        messagebox.showerror("Error", f"An error occurred: {str(e)}")

# Setting up the GUI window
root = tk.Tk()
root.title("File and Folder Combiner")

canvas = tk.Canvas(root, height=300, width=400)
canvas.pack()

frame = tk.Frame(root, bg="white")
frame.place(relwidth=0.8, relheight=0.5, relx=0.1, rely=0.2)

button = tk.Button(root, text="Combine Files or Folder", padx=10, pady=5, fg="white", bg="#263D42", command=combine_files)
button.pack()

root.mainloop()
